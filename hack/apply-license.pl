#!/usr/bin/env perl

=license

Copyright 2019 Tom Peters

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

=cut

use 5.016;
use warnings;
use File::Temp();

my $year    = (localtime)[5] + 1900;
my $license = <<"EOF";
Copyright $year Tom Peters

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see https://www.gnu.org/licenses/.
EOF

chomp( my @files = `git ls-files --cached --others --exclude-standard -- '*.js' '*.css' '*.vue'` );

for my $file (@files) {
	open my $fh, '<', $file
		or die "could not read file $file: $!\n";
	my $content = do { local $/ = undef; <$fh> };
	close $fh;

	if ( $content =~ /\QGNU Affero General Public License/x ) {
		next;
	}

	my $opening_comment = '/*';
	my $closing_comment = '*/';

	my $tmp = File::Temp->new;
	print $tmp "$opening_comment\n$license$closing_comment\n\n$content"
		or die "could not write to tempfile: $!\n";
	close $tmp
		or die "could not close tempfile: $!\n";

	say "adding license to $file...";
	rename $tmp->filename, $file
		or die "could not move ${ \$tmp->filename } to $file: $!\n";
}
